import { NavLink } from 'react-router-dom'
import './UserBottomNav.css'

const UserBottomNav = () => (
  <nav className="user-bottom-nav" aria-label="User navigation">
    <NavLink
      className={({ isActive }) => `user-bottom-nav__link${isActive ? ' is-active' : ''}`}
      to="/user/dashboard"
      end
    >
      <span className="user-bottom-nav__icon" aria-hidden="true">⌂</span>
      <span>Home</span>
    </NavLink>
    <NavLink
      className={({ isActive }) => `user-bottom-nav__link${isActive ? ' is-active' : ''}`}
      to="/user/saved"
    >
      <span className="user-bottom-nav__icon" aria-hidden="true">▣</span>
      <span>Saved</span>
    </NavLink>
    <NavLink
      className={({ isActive }) => `user-bottom-nav__link${isActive ? ' is-active' : ''}`}
      to="/user/profile"
    >
      <span className="user-bottom-nav__icon" aria-hidden="true">♙</span>
      <span>Profile</span>
    </NavLink>
  </nav>
)

export default UserBottomNav
