/* eslint-disable react/prop-types */


function Chatbox({id,participants}) {


  return (
    <>
    <div>ID: {id}</div>
    <div>{participants[0]}</div>
    </>
  )
}

export default Chatbox