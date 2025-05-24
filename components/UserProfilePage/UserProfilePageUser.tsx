import { UserRequestdata } from "@/utils/types";
import ChangePasswordUser from "../UserAdminProfile/ChamgePasswordUser";
import PersonalInformationUser from "../UserAdminProfile/PersonalInformationUser";

type Props = {
  userProfile: UserRequestdata;
};

const UserProfilePageUser = ({ userProfile }: Props) => {
  return (
    <div className="mx-auto py-8">
      <div className="w-full flex flex-col gap-6 sm:p-10">
        {/* Page Title */}
        <header>
          <h1 className="text-2xl font-bold stroke-text-orange">
            User Profile
          </h1>
        </header>

        <PersonalInformationUser userProfile={userProfile} />
        <ChangePasswordUser userProfile={userProfile} />
      </div>
    </div>
  );
};

export default UserProfilePageUser;
