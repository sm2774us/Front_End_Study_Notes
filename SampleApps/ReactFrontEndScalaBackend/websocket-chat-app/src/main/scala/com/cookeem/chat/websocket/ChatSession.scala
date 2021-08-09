package com.cookeem.chat.websocket

import akka.NotUsed
import akka.actor.{ActorRef, ActorSystem, Props}
import akka.http.scaladsl.model.ws.TextMessage.Strict
import akka.http.scaladsl.model.ws.{BinaryMessage, Message, TextMessage}
import akka.stream._
import akka.stream.scaladsl._
import akka.util.ByteString
import com.cookeem.chat.common.CommonUtils._
import com.cookeem.chat.event._
import com.cookeem.chat.mongo.MongoLogic._
import com.cookeem.chat.mongo._
import play.api.libs.json.Json

import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.duration._

/**
  * Created by cookeem on 16/9/25.
  */
class ChatSession()(implicit ec: ExecutionContext, actorSystem: ActorSystem, materializer: ActorMaterializer) {
  implicit val chatMessageWrites = Json.writes[ChatMessage]

  val chatSessionActor = actorSystem.actorOf(Props(classOf[ChatSessionActor]))
  consoleLog("INFO", s"create new chatSessionActor: $chatSessionActor")

  val source: Source[WsMessageDown, ActorRef] = Source.actorRef[WsMessageDown](bufferSize = Int.MaxValue, OverflowStrategy.fail)
  def chatService: Flow[Message, Strict, ActorRef] = Flow.fromGraph(GraphDSL.create(source) { implicit builder =>
    chatSource =>
      import GraphDSL.Implicits._

      val flowFromWs: FlowShape[Message, WsMessageUp] = builder.add(
        Flow[Message].collect {
          case tm: TextMessage =>
            tm.textStream.runFold("")(_ + _).map { jsonStr =>
              var userTokenStr = ""
              var sessionTokenStr = ""
              var msgType = ""
              var content = ""
              try {
                val json = Json.parse(jsonStr)
                userTokenStr = getJsonString(json, "userToken")
                sessionTokenStr = getJsonString(json, "sessionToken")
                msgType = getJsonString(json, "msgType")
                content = getJsonString(json, "content")
              } catch { case e: Throwable =>
                consoleLog("ERROR", s"parse websocket text message error: $e")
              }
              val UserSessionInfo(uid, nickname, avatar, sessionid, sessionName, sessionIcon) = verifyUserSessionToken(userTokenStr, sessionTokenStr)
              WsTextUp(uid, nickname, avatar, sessionid, sessionName, sessionIcon, msgType, content)
            }
          case bm: BinaryMessage =>
            bm.dataStream.runFold(ByteString.empty)(_ ++ _).map { bs =>
              val splitor = "<#BinaryInfo#>"
              val (bsJson, bsBin) = bs.splitAt(bs.indexOfSlice(splitor))
              val jsonStr = bsJson.utf8String
              val bsFile = bsBin.drop(splitor.length)
              var userTokenStr = ""
              var sessionTokenStr = ""
              var msgType = ""
              var fileName = ""
              var fileSize = 0L
              var fileType = ""
              try {
                val json = Json.parse(jsonStr)
                userTokenStr = getJsonString(json, "userToken")
                sessionTokenStr = getJsonString(json, "sessionToken")
                msgType = getJsonString(json, "msgType")
                fileName = getJsonString(json, "fileName")
                fileSize = getJsonLong(json, "fileSize")
                fileType = getJsonString(json, "fileType")
              } catch { case e: Throwable =>
                consoleLog("ERROR", s"parse websocket binary message error: $e")
              }
              val UserSessionInfo(uid, nickname, avatar, sessionid, sessionName, sessionIcon) = verifyUserSessionToken(userTokenStr, sessionTokenStr)
              WsBinaryUp(uid, nickname, avatar, sessionid, sessionName, sessionIcon, msgType, bsFile, fileName, fileSize, fileType)
            }
        }.buffer(1024 * 1024, OverflowStrategy.fail).mapAsync(6)(t => t)
      )

      val broadcastWs: UniformFanOutShape[WsMessageUp, WsMessageUp] = builder.add(Broadcast[WsMessageUp](2))

      val filterFailure: FlowShape[WsMessageUp, WsMessageUp] = builder.add(Flow[WsMessageUp].filter(_.uid == ""))
      val flowReject: FlowShape[WsMessageUp, WsTextDown] = builder.add(
        Flow[WsMessageUp].map(_ => WsTextDown("", "", "", "", "", "", "reject", "no privilege to send message"))
      )

      val filterSuccess: FlowShape[WsMessageUp, WsMessageUp] = builder.add(Flow[WsMessageUp].filter(_.uid != ""))

      val flowAccept: FlowShape[WsMessageUp, WsMessageDown] = builder.add(
        Flow[WsMessageUp].collect {
          case WsTextUp(uid, nickname, avatar, sessionid, sessionName, sessionIcon, msgType, content) =>
            Future(
              WsTextDown(uid, nickname, avatar, sessionid, sessionName, sessionIcon, msgType, content)
            )
          case WsBinaryUp(uid, nickname, avatar, sessionid, sessionName, sessionIcon, msgType, bs, fileName, fileSize, fileType) =>
            val bytes = bs.toArray
            writeGridFile(uid, bytes, fileName, fileType).map { fileid =>
              var futureThumbid = createThumbId(uid, bytes, fileName, fileType)
              futureThumbid.map( thumbid => (fileid, thumbid))
            }.flatMap(t => t).map { case (fileid, thumbid) =>
              WsBinaryDown(uid, nickname, avatar, sessionid, sessionName, sessionIcon, msgType, fileName, fileType, fileid, thumbid)
            }
        }.buffer(1024 * 1024, OverflowStrategy.fail).mapAsync(6)(t => t)
      )

      val mergeAccept: UniformFanInShape[WsMessageDown, WsMessageDown] = builder.add(Merge[WsMessageDown](2))

      val connectedWs: Flow[ActorRef, UserOnline, NotUsed] = Flow[ActorRef].map { actor =>
        UserOnline(actor)
      }

      val chatActorSink: Sink[WsMessageDown, NotUsed] = Sink.actorRef[WsMessageDown](chatSessionActor, UserOffline)

      val flowAcceptBack: FlowShape[WsMessageDown, WsMessageDown] = builder.add(
        // websocket default timeout after 60 second, to prevent timeout send keepalive message
        // you can config akka.http.server.idle-timeout to set timeout duration
        Flow[WsMessageDown].keepAlive(50.seconds, () => WsTextDown("", "", "", "", "", "", "keepalive", ""))
      )

      val mergeBackWs: UniformFanInShape[WsMessageDown, WsMessageDown] = builder.add(Merge[WsMessageDown](2))

      val flowBackWs: FlowShape[WsMessageDown, Strict] = builder.add(
        Flow[WsMessageDown].collect {
          case WsTextDown(uid, nickname, avatar, sessionid, sessionName, sessionIcon, msgType, content, dateline) =>
            val chatMessage = ChatMessage(uid, nickname, avatar, msgType, content, fileName = "", fileType = "", fileid = "", thumbid = "", dateline)
            TextMessage(Json.stringify(Json.toJson(chatMessage)))
          case WsBinaryDown(uid, nickname, avatar, sessionid, sessionName, sessionIcon, msgType, fileName, fileType, fileid, thumbid, dateline) =>
            val chatMessage = ChatMessage(uid, nickname, avatar, msgType, content = "", fileName, fileType, fileid, thumbid, dateline)
            TextMessage(Json.stringify(Json.toJson(chatMessage)))
        }
      )
      flowFromWs ~> broadcastWs
      broadcastWs ~> filterFailure ~> flowReject

      broadcastWs ~> filterSuccess ~> flowAccept ~> mergeAccept.in(0)
      builder.materializedValue ~> connectedWs ~> mergeAccept.in(1)
      mergeAccept ~> chatActorSink // --> to chatSessionActor

      /* from chatSessionActor --> */ chatSource ~> flowAcceptBack ~> mergeBackWs.in(0)
      flowReject ~> mergeBackWs.in(1)
      mergeBackWs ~> flowBackWs

      FlowShape(flowFromWs.in, flowBackWs.out)
  })

}
