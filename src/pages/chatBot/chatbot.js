import React, { useEffect, useState } from "react";
import Util from "../../commons/util/util";

export default function ChatBot(props) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (props.showChatBot) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, []);

  return <>{show ? Util.chatBot(props.chatBotUrl, props?.path) : null}</>;
}
