import { Outlet, Link } from "react-router-dom"

function Layout(){
  return (
    <div>
        <nav>
            <div className="nav-text">
                Robert F. Wagner College Corner
            </div>
            <div className="nav-links">
                <Link className='NavButtonStyles' to="/">
                    HOME
                </Link>
                <Link className='NavButtonStyles' to="/resources">
                    RESOURCES
                </Link>
                <Link className='NavButtonStyles' to="/faq">
                    GET HELP
                </Link>
            </div>
        </nav>
        {/*make the content of each page starts under the nav bar*/}
        <div className="main-content">
          <Outlet />
        </div>
    </div>
  )
}

export default Layout