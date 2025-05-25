import { package_table } from "@prisma/client";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import AvailPackagePage from "../AvailPackagePage/AvailPackagePage";
import AvailPromoPackage from "../DashboardPage/DashboardReinvestPromoPackage/AvailPromoPackage";

type Props = {
  onClick: () => void;
  selectedPackage: package_table | null;
  setSelectedPackage: Dispatch<SetStateAction<package_table | null>>;
  packages: package_table;
  type?: "reinvest" | "avail";
};

const PackageCard = ({
  onClick,
  packages,
  selectedPackage,
  setSelectedPackage,
  type = "avail",
}: Props) => {
  return (
    <div className="relative">
      <Image
        src={packages.package_image || ""}
        unoptimized
        alt={packages.package_name}
        width={1200}
        height={1000}
        priority
        className={`rounded-md cursor-pointer transition-transform hover:scale-105`}
      />

      {type === "reinvest" && (
        <AvailPromoPackage
          onClick={onClick}
          selectedPackage={selectedPackage}
          setSelectedPackage={setSelectedPackage}
        />
      )}

      {type === "avail" && (
        <AvailPackagePage onClick={onClick} selectedPackage={selectedPackage} />
      )}
    </div>
  );
};

export default PackageCard;
