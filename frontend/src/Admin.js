function Admin() {

  const handleLogout = () => {
    localStorage.removeItem("auth");
    window.location.href = "/login";
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome to Clinical Panel</p>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Admin;