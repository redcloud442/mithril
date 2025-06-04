import DashboardWithdrawModalWithdraw from "../DashboardPage/DashboardWithdrawRequest/DashboardWithdrawModal/DashboardWithdrawModalWithdraw";
import ReusableCard from "../ui/card-reusable";

const WithdrawPage = () => {
  return (
    <ReusableCard
      type="user"
      title="Withdraw Request"
      className="flex items-start justify-center h-full p-0 sm:p-4"
    >
      <DashboardWithdrawModalWithdraw />
    </ReusableCard>
  );
};

export default WithdrawPage;
