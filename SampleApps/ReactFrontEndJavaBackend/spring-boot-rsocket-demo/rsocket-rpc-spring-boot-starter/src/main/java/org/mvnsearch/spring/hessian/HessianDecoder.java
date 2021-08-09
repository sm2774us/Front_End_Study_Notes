package org.mvnsearch.spring.hessian;

import org.reactivestreams.Publisher;
import org.springframework.core.ResolvableType;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.http.codec.HttpMessageDecoder;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.util.MimeType;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;

/**
 * hessian decoder
 *
 * @author linux_china
 */
public class HessianDecoder extends HessianCodecSupport implements HttpMessageDecoder<Object> {

    @Override
    public Map<String, Object> getDecodeHints(ResolvableType actualType, ResolvableType elementType, ServerHttpRequest request, ServerHttpResponse response) {
        return null;
    }

    @Override
    public boolean canDecode(ResolvableType elementType, MimeType mimeType) {
        return HESSIAN_MIME_TYPE.equals(mimeType);
    }

    @Override
    public Flux<Object> decode(Publisher<DataBuffer> inputStream, ResolvableType elementType, MimeType mimeType, Map<String, Object> hints) {
        return null;
    }

    @Override
    public Mono<Object> decodeToMono(Publisher<DataBuffer> inputStream, ResolvableType elementType, MimeType mimeType, Map<String, Object> hints) {
        return Mono.from(inputStream).handle((dataBuffer, sink) -> {
            try {
                sink.next(decode(dataBuffer));
            } catch (Exception e) {
                sink.error(e);
            }
        });
    }

    @Override
    public List<MimeType> getDecodableMimeTypes() {
        return HESSIAN_MIME_TYPES;
    }
}
