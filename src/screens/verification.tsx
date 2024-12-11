import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { BecomeAVendorSchemaType } from "@/schemas/become-a-vendor";
import { useFormContext } from "react-hook-form";

const Verification = () => {
  const { control, getValues } = useFormContext<BecomeAVendorSchemaType>();
  return (
    <div className="container">
      <div className="flex flex-col items-center justify-center text-center">
        <h2>
          Enter the code sent to **********@
          {getValues("step1.email").split("@")[1]}
        </h2>

        <div className="">
          <FormField
            control={control}
            name="step3.otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP
                    maxLength={6}
                    {...field}
                    className="flex items-center justify-center"
                  >
                    <InputOTPGroup className="flex items-center justify-center">
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormDescription>
                  Please enter the one-time password sent to your phone.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Verification;
