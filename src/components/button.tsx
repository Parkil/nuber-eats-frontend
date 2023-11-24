import React from "react";

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({canClick,loading, actionText}) => {
  return (
    <button className={`${canClick ? 'bg-lime-500 hover:bg-lime-700' : 'bg-gray-300 pointer-events-none'} btn`}>
      {loading ? "Loading..." : actionText}
    </button>
  )
}
