import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { addColonist, addColonistRemote } from './features/colonySlice';
import ColonistList from "./components/colony/ColonistList";
import logo from './logo.svg';
import './App.css';

/*
const mapPropsToState = (state:any) => {
  colonists: state.colonsits;
};*/
const mapStateToProps = (state:any) => {
  return {
    colonists: state.colony.colonists
  }
}

const mapDispatch = { addColonist, addColonistRemote }

type Colonist = {
  name: string
}

interface AppProps {
  addColonist: any, // lazy I know... 
  colonists: any
}

const App: React.FC<AppProps> = ({ addColonist, colonists }) => {

  const [colonistName, setColonistName] = useState('')
  console.log("App colonists: ", colonists);
  const appRef = useRef(null);

  const onChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setColonistName(value)
  }

  useEffect( () => {

    if (appRef.current) {
    //console.log("App colonists: ", colonists);
    }

  });

  return (
    <div style={{display: "flex", alignItems: "center", flexDirection: "column", width: "100vw"}}>
      <div style={{display: "block", width: "400px"}} ref={appRef}>
      <img src={logo} width="200px" alt="secord logo" />
      <ColonistList page={1} />
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!colonistName.trim()) {
            return
          }
          console.log("form submit");
          //addColonist(colonistName)
          //addColonistRemote(colonistName)
          setColonistName('')

    
          fetch(`http://localhost:8080/demo/add?name=${colonistName}`, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
              'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // no-referrer, *client
          }).then(
            response => {
              console.log("App on submit response: ", response);
              if (response.status === 200) {
                //state.push({ id, name})
              }
            }
          )

        }}
      >
        <input value={colonistName} onChange={onChange} />
        <button type="submit">Add Colonist</button>
      </form>
      </div>
    </div>)
}

export default connect(
  mapStateToProps,
  mapDispatch
)(App)
