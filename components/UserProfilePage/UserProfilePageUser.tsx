"use client";
import ChangePasswordUser from "../UserAdminProfile/ChamgePasswordUser";
import PersonalInformationUser from "../UserAdminProfile/PersonalInformationUser";
import AddFacebookLink from "./AddFacebookLink";

const UserProfilePageUser = () => {
  return (
    <div className="mx-auto py-8">
      <div className="w-full flex flex-col gap-6 sm:p-10">
        {/* Page Title */}
        <header>
          <h1 className="text-2xl font-bold stroke-text-orange">
            User Profile
          </h1>
        </header>

        <PersonalInformationUser />
        <ChangePasswordUser />
        <AddFacebookLink />
      </div>
    </div>
  );
};

export default UserProfilePageUser;
