import DashboardDepositModalDeposit from "../DashboardPage/DashboardDepositRequest/DashboardDepositModal/DashboardDepositModalDeposit";
import DepositLimitOverlay from "../DashboardPage/DashboardDepositRequest/DashboardDepositModal/OverlayLimit";
import ReusableCard from "../ui/card-reusable";

type DepositLimit = {
  depositLimit: number;
};

const DepositPage = ({ depositLimit }: DepositLimit) => {
  const isDepositLimited = depositLimit >= 50000;
  return (
    <>
      {isDepositLimited ? (
        <DepositLimitOverlay
          isVisible={isDepositLimited}
          depositLimit={depositLimit}
          maxLimit={50000}
        />
      ) : (
        <ReusableCard
          type="user"
          title="Deposit Request"
          className="flex items-start justify-center h-full p-0 sm:p-4"
        >
          <DashboardDepositModalDeposit depositLimit={depositLimit} />
        </ReusableCard>
      )}
    </>
  );
};

export default DepositPage;
