import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import { useProfileMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setFirstName(userInfo.data.user.firstName);
    setLastName(userInfo.data.user.lastName);
    setEmail(userInfo.data.user.email);
  }, [
    userInfo.data.user.email,
    userInfo.data.user.username,
    userInfo.data.user.lastName,
  ]);

  const dispatch = useDispatch();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await updateProfile({
        _id: userInfo.data.user._id,
        firstName,
        lastName,
        email,
        oldPassword,
        newPassword,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container mx-auto p-4 mt-[2rem]">
      <div className="flex justify-center align-center md:flex md:space-x-4">
        <div className="md:w-1/3 w-[90vw]">
          <h2 className="text-2xl font-semibold mb-4">Update Profile</h2>
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label className="block mb-2">First Name</label>
              <input
                type="text"
                placeholder="Enter first name"
                className="form-input p-2 rounded-md w-full border-2 border-black"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block  mb-2">Last Name</label>
              <input
                type="text"
                placeholder="Enter last name"
                className="form-input p-2 rounded-md w-full border-2 border-black"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block  mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter email"
                className="form-input p-2 rounded-md w-full border-2 border-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block  mb-2">Old Password</label>
              <input
                type="password"
                placeholder="Enter old password"
                className="form-input p-2 rounded-md w-full border-2 border-black"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block  mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="form-input p-2 rounded-md w-full border-2 border-black"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              <button
                type="submit"
                className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600"
              >
                Update
              </button>

              <Link
                to="/user-orders"
                className="bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-700"
              >
                My Orders
              </Link>
            </div>
            {loadingUpdateProfile && <Loader />}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
