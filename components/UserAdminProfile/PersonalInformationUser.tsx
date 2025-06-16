"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUserSponsor } from "@/services/User/User";
import { useRole } from "@/utils/context/roleContext";
import { useEffect, useState } from "react";
import ReusableCard from "../ui/card-reusable";

const PersonalInformationLayout = () => {
  const { profile } = useRole();
  const [userSponsor, setUserSponsor] = useState<{
    user_username: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserSponsor = async () => {
      try {
        const userSponsor = await getUserSponsor({
          userId: profile.user_id,
        });

        setUserSponsor({ user_username: userSponsor });
      } catch (e) {
        console.error(e);
      }
    };
    fetchUserSponsor();
  }, [profile.user_id]);

  return (
    <ReusableCard title={"Personal Information"}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Label className="text-sm font-medium">Sponsor</Label>
          <Input
            id="sponsor"
            type="text"
            variant="non-card"
            value={userSponsor?.user_username ?? ""}
            readOnly
            className="mt-1 border-gray-300"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">First Name</Label>
          <Input
            id="firstName"
            type="text"
            variant="non-card"
            value={profile.user_first_name || ""}
            readOnly
            className="mt-1 border-gray-300"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Last Name</Label>
          <Input
            id="lastName"
            variant="non-card"
            type="text"
            value={profile.user_last_name || ""}
            readOnly
            className="mt-1 border-gray-300"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Username</Label>
          <Input
            id="userName"
            variant="non-card"
            type="text"
            value={profile.user_username || ""}
            readOnly
            className="mt-1 border-gray-300"
          />
        </div>
      </div>
    </ReusableCard>
  );
};

export default PersonalInformationLayout;
