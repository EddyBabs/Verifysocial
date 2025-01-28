import { Order } from "@prisma/client";
import QRCode from "react-qr-code";
import GenerateCodeSection from "./generate-code-section";

const ViewCodeSection = ({ order }: { order: Order }) => {
  return (
    <div>
      <div>
        <div className="space-y-14">
          <div>
            <h4 className="text-xl font-semibold">Generate Codes</h4>
            <h6 className="font-semibold">
              Generate codes and send to your customers to confirm your
              verification
            </h6>
          </div>
          <div className="flex items-center justify-center">
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: 400, width: "100%" }}
              value={order.code}
              viewBox={`0 0 256 256`}
            />
          </div>
          <GenerateCodeSection order={order} />
        </div>
      </div>
    </div>
  );
};

export default ViewCodeSection;
