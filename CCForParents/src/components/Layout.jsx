import { Outlet, Link } from "react-router-dom"

function Layout(){
  return (
    <div>
        <nav>
            <div className="nav-text">
                <img src="/images/logo.png" alt="College Logo" className="nav-logo" />
                Robert F. Wagner Jr SSAT
            </div>
            <div className="nav-links">
                <Link className='NavButtonStyles' to="/">
                    HOME
                </Link>
                <Link className='NavButtonStyles' to="/resources">
                    RESOURCES
                </Link>
                <Link className='NavButtonStyles' to="/faq">
                    ASK QUESTIONS
                </Link>
                <Link className='NavButtonStyles' to="/contact">
                    CONTACT US
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