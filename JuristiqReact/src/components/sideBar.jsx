import { useNavigate } from "react-router-dom"

function SideBar() {

  const navigate = useNavigate();

  const handleHome=()=>{
    console.log("Home clicked");
    navigate('/home');
  }
  const handleMyCases=()=>{
    console.log("My Cases clicked");
    navigate('/myCases');
  }
  const handleClients=()=>{
    console.log("Clients clicked");
    navigate('/clients');
  }
  const handleFees=()=>{
    console.log("Fees clicked");
    navigate('/fees');
  }
  const handleProfile=()=>{
    console.log("Profile clicked");
    navigate('/profile');
  }

  return (
    <div className="sideBar">
        <div className="logo">JuristiQ</div>
        <div className="search">Search</div>
        <div className="options">
                <button onClick={handleHome }>Home</button>
                <button onClick={handleMyCases }>My Cases</button>
                <button onClick={handleClients}>Clients</button>
                <button onClick={handleFees}>Fees</button>
                <button onClick={handleProfile}>Profile</button>
            
        </div>
        <hr/>
        <button className="logout-button">Log Out</button>
    </div>
  )
}

export default SideBar