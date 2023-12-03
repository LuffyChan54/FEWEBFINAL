import { Button } from "antd";

const SubmitButton = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <span>
      <Button
        type="primary"
        // disabled={isLoading}
        loading={isLoading}
        htmlType="submit"
      >
        Submit
      </Button>
    </span>
  );
};

export default SubmitButton;
