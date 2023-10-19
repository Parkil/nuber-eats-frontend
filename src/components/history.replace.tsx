import React from "react";
import {useHistory} from "react-router-dom";

interface IHistoryReplaceProps {
  condition?: boolean;
  url: string;
}

export const HistoryReplace: React.FC<IHistoryReplaceProps> = ({condition, url}) => {
  const history = useHistory();
  return <>{condition && history.replace(url)}</>;
}
