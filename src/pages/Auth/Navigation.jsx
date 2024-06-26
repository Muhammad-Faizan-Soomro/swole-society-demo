import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
  AiOutlineDashboard,
  AiOutlineLogout,
  AiOutlineUser,
  AiOutlineBars,
  AiOutlineAppstoreAdd,
  AiOutlineInbox,
  AiOutlineGroup,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import Hamburger from "hamburger-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetCookiesQuery,
  useLogoutMutation,
} from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import Cookies from "js-cookie";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  // const { data: cookie, refetch, isLoading, error } = useGetCookiesQuery();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const [showSideDrawer, setshowSideDrawer] = useState(false);

  const toggleScroll = () => {
    if (showSideDrawer === true) {
      sideDrawerClosedHandler();
    }
    if (showSideDrawer === false) {
      showSideDrawerbar();
    }
  };

  //  FUNCTION TO HANDLE CLOSE ACTION ON SIDEDRAWER/MODAL
  const sideDrawerClosedHandler = () => {
    setshowSideDrawer(false);

    // Unsets Background Scrolling to use when SideDrawer/Modal is closed
    document.body.style.overflow = "unset";
  };

  // FUNCTION TO HANDLE OPEN ACTION ON SIDEDRAWER/MODAL
  const showSideDrawerbar = () => {
    setshowSideDrawer(true);

    // Disables Background Scrolling whilst the SideDrawer/Modal is open
    if (typeof window != "undefined" && window.document) {
      document.body.style.overflow = "hidden";
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    // if (Object.keys(cookie.data).length == 0) {
    //   dispatch(logout());
    //   navigate("/login");
    //   setDropdownOpen(false);
    //   toggleScroll();
    // } else {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      setDropdownOpen(false);
      toggleScroll();
    } catch (error) {
      toast.error("failed to logout, try again.")
    }
  };

  return (
    <>
      <div className="lg:hidden right-0 absolute">
        <Hamburger toggled={showSideDrawer} toggle={toggleScroll} size={18} />
        <div
          style={{ zIndex: 9999 }}
          className={`${
            showSideDrawer ? "flex" : "hidden"
          } w-[100vw] absolute right-0 overflow  bg-black opacity-90 h-[100vh]`}
        >
          <div
            className={` ${
              userInfo && userInfo.data.user.isAdmin
                ? "mt-8 gap-y-[1.4rem]"
                : "justify-center gap-8"
            } w-[90vw] flex items-center flex-col `}
          >
            <Link
              to="/"
              className="flex text-white items-center"
              onClick={toggleScroll}
            >
              <AiOutlineHome className="mr-2" size={26} />
              <span className="text-lg text-white">HOME</span>{" "}
            </Link>

            <Link
              to="/shop"
              className="flex text-white items-center"
              onClick={toggleScroll}
            >
              <AiOutlineShopping className="mr-2" size={26} />
              <span className="text-lg text-white">SHOP</span>{" "}
            </Link>

            <Link
              to="/cart"
              className="flex text-white items-center"
              onClick={toggleScroll}
            >
              <AiOutlineShoppingCart className="mr-2" size={26} />
              <span className="text-lg text-white">CART</span>{" "}
            </Link>

            {userInfo && (
              <>
                {userInfo.data.user.isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center text-white"
                      onClick={toggleScroll}
                    >
                      <AiOutlineDashboard className="mr-2" size={26} />
                      <span className="text-lg text-white">Dashboard</span>
                    </Link>
                    <Link
                      to="/admin/productlist"
                      className="flex items-center text-white"
                      onClick={toggleScroll}
                    >
                      <AiOutlineAppstoreAdd className="mr-2" size={26} />
                      <span className="text-lg text-white">ADD PRODUCT</span>
                    </Link>
                    <Link
                      to="/admin/allproductslist"
                      className="flex items-center text-white"
                      onClick={toggleScroll}
                    >
                      <AiOutlineInbox className="mr-2" size={24} />
                      <span className="text-lg text-white">ALL PRODUCTS</span>
                    </Link>
                    <Link
                      to="/admin/categorylist"
                      className="flex items-center text-white"
                      onClick={toggleScroll}
                    >
                      <AiOutlineBars className="mr-2" size={26} />
                      <span className="text-lg text-white">CATEGORY</span>
                    </Link>
                    <Link
                      to="/admin/orderlist"
                      className="flex items-center text-white"
                      onClick={toggleScroll}
                    >
                      <AiOutlineGroup className="mr-2" size={22} />
                      <span className="text-lg text-white">ORDERS</span>
                    </Link>
                    <Link
                      to="/admin/userlist"
                      className="flex items-center text-white"
                      onClick={toggleScroll}
                    >
                      <AiOutlineUsergroupAdd className="mr-2" size={26} />
                      <span className="text-lg text-white">USERS</span>
                    </Link>
                  </>
                )}
                <Link
                  to="/profile"
                  className="flex items-center text-white"
                  onClick={toggleScroll}
                >
                  <AiOutlineUser className="mr-2" size={26} />
                  <span className="text-lg text-white">PROFILE</span>
                </Link>
                <Link
                  className="flex items-center text-white"
                  onClick={logoutHandler}
                >
                  <AiOutlineLogout className="mr-2" size={26} />
                  <span className="text-lg text-white">LOGOUT</span>
                </Link>
              </>
            )}

            {!userInfo && (
              <>
                <Link
                  to="/login"
                  className="flex items-center text-white"
                  onClick={toggleScroll}
                >
                  <AiOutlineLogin className="mr-2" size={26} />
                  <span className="text-lg text-white">LOGIN</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center text-white"
                  onClick={toggleScroll}
                >
                  <AiOutlineUserAdd className="mr-2" size={26} />
                  <span className="text-lg text-white">REGISTER</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div
        style={{ zIndex: 9999 }}
        className={`${
          showSidebar ? "hidden" : "flex"
        } hidden lg:flex flex-col justify-between p-4 text-white bg-[#000] h-[100vh] w-[18vw] max-w-[10rem] hover:w-[38vw] hover:max-w-[38vw] md:w-[10vw] md:hover:w-[30vw] lg:w-[8vw] lg:hover:w-[18vw] 2xl:w-[6vw] 2xl:hover:w-[13vw]  fixed `}
        id="navigation-container"
      >
        <div className="flex flex-col justify-center space-y-4">
          <Link
            to="/"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <AiOutlineHome className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem] lg:text-lg text-sm">
              HOME
            </span>{" "}
          </Link>

          <Link
            to="/shop"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <AiOutlineShopping className="mr-2 mt-[3rem]" size={26} />
            <span className="hidden nav-item-name mt-[3rem] lg:text-lg text-sm">
              SHOP
            </span>{" "}
          </Link>

          <Link
            to="/cart"
            className="flex items-center transition-transform transform hover:translate-x-2"
          >
            <AiOutlineShoppingCart className="mt-[3rem] mr-2" size={26} />
            <span className="hidden nav-item-name mt-[3rem] lg:text-lg text-sm">
              CART
            </span>{" "}
            <div className="absolute top-9">
              {cartItems.length > 0 && (
                <span>
                  <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                    {cartItems.reduce((a, c) => a + Number(c.qty), 0)}
                  </span>
                </span>
              )}
            </div>
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center text-gray-800 focus:outline-none"
          >
            {userInfo ? (
              <span className="text-white">{userInfo.data.user.firstName}</span>
            ) : (
              <></>
            )}
            {userInfo && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 ml-1 ${
                  dropdownOpen ? "transform rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
            )}
          </button>

          {dropdownOpen && userInfo && (
            <ul
              className={`absolute right-0 mt-2 mr-14 space-y-2 bg-white text-gray-600 ${
                !userInfo.data.user.isAdmin ? "-top-20" : "-top-[25rem]"
              } `}
            >
              {userInfo.data.user.isAdmin && (
                <>
                  <li>
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/productlist"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Add Product
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/allproductslist"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/categorylist"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Category
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/orderlist"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/admin/userlist"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Users
                    </Link>
                  </li>
                </>
              )}

              <li>
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={logoutHandler}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
          {!userInfo && (
            <ul>
              <li>
                <Link
                  to="/login"
                  className="flex items-center mt-5 transition-transform transform hover:translate-x-2"
                >
                  <AiOutlineLogin className="mr-2 mt-[4px]" size={26} />
                  <span className="hidden nav-item-name lg:text-lg text-sm">
                    LOGIN
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="flex items-center mt-5 lg:mb-1 transition-transform mb-11 transform hover:translate-x-2"
                >
                  <AiOutlineUserAdd className="mr-2 mt-[4px]" size={26} />
                  <span className="hidden nav-item-name lg:text-lg text-sm">
                    REGISTER
                  </span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default Navigation;
