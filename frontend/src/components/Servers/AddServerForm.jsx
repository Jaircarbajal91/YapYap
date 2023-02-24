const AddServerForm = () => {
  
  return (
    <div>
      <h1>Create a server</h1>
      <form className="flex flex-col">
        <label htmlFor="serverName">Server Name</label>
        <input type="text" name="serverName" id="serverName" />
        <label htmlFor="serverImage">Server Image</label>
        <input type="file" name="serverImage" id="serverImage" />
        <button type="submit">Create Server</button>
      </form>
    </div>
  )

}

export default AddServerForm
