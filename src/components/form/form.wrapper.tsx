import React, {ReactNode} from "react";

interface IFormWrapperProps {
  children: ReactNode;
}

export const FormWrapper: React.FC<IFormWrapperProps> = ({children}) => {
  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        {children}
      </div>
    </div>
  );
}
