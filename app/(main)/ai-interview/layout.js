import { Toaster } from "sonner";
import { Suspense } from "react";
import { BarLoader } from "react-spinners";

const RootLayout = ({ children }) => {
  return (
      <div className='px-5'>
        <Toaster richColors position="top-right" />
          <Suspense 
              fallback={<BarLoader className="mt-4 " width={"100%"} color="gray"/>}>
                  {children}
              </Suspense>
      </div>
  );
}

export default RootLayout;
