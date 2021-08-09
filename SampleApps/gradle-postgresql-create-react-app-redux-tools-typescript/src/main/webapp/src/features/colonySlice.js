import { createSlice } from '@reduxjs/toolkit'

const colonySlice = createSlice({
  name: 'colony',
  initialState: {colonists: [{name: "R2D2", id: 0}]},
  reducers: {
    addColonist(state, action) {
      const { id, name } = action.payload
      state.push({ id, name})
    },
    addColonistRemote(state, action) {

      const { name } = action.payload
      console.log("addColonistRemote name: ", name);
      const config = {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'no-cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json'
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
      }

      fetch(`http://localhost:8080/demo/add?name=${name}`, config).then(
        response => {
          console.log("addColonistRemote response: ", response);
          if (response.status === 200) {
            //state.push({ id, name})
          }
        }
      )
    }
  }
})

export const { addColonist, addColonistRemote } = colonySlice.actions

export default colonySlice.reducer