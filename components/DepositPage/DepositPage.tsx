import DashboardDepositModalDeposit from "../DashboardPage/DashboardDepositRequest/DashboardDepositModal/DashboardDepositModalDeposit";
import ReusableCard from "../ui/card-reusable";

const DepositPage = () => {
  return (
    <ReusableCard
      type="user"
      title="Deposit Request"
      className="flex items-start justify-center h-full p-0 sm:p-4"
    >
      <DashboardDepositModalDeposit />
    </ReusableCard>
  );
};

export default DepositPage;
