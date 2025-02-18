import PropTypes from "prop-types";
import AsideChat from "./AsideChat";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import cat from "../assets/undraw_cat_lqdj.svg";
import { useDispatch } from "react-redux";
import { setUserChats } from "../store/redux/chatSlice";
import ItemSkeleton from "./ItemSkeleton";

export default function AsideChatWrapper() {
  const token = localStorage.getItem("token");
  const [activeSelect, setActiveSelect] = useState("users");

  const dispatch = useDispatch();

  const handleGetChats = async () => {
    try {
      let url = "http://localhost:3000/chat";
      if (activeSelect === "users") url += "/get-user-chats";
      if (activeSelect === "all") url += "/get-all-chats";

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Couldn't fetch chats.");
      }

      if (activeSelect === "users") dispatch(setUserChats(data.data.chats));

      return data;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const { data: chats, isLoading } = useQuery({
    queryFn: handleGetChats,
    queryKey: ["chats", activeSelect],
  });

  const length = activeSelect === "all" ? 15 : 7;

  return (
    <div className="h-full">
      <header className="py-2 h-[3rem] flex border-b-2 border-b-[#151515] border-[#202021] w-full text-[#ccc] font-semibold mb-4">
        <p
          onClick={() => setActiveSelect("users")}
          className={`px-4 cursor-pointer hover:text-[#8765DC] transition-all ${
            activeSelect !== "users" ? "text-[#ccc]" : "text-[#8675DC]"
          }`}
        >
          Your chats
        </p>
        <p
          onClick={() => setActiveSelect("all")}
          className={`px-4 cursor-pointer hover:text-[#8765DC] transition-all ${
            activeSelect !== "all" ? "text-[#ccc]" : "text-[#8675DC]"
          }`}
        >
          All chats
        </p>
      </header>
      <ul className="flex flex-col px-2 overflow-y-auto h-[88vh]">
        {isLoading &&
          Array.from({ length }).map((_, index) => (
            <ItemSkeleton key={index} />
          ))}
        {!isLoading &&
          chats?.data?.chats?.map((chat, index) => {
            const uniqueKey = chat._id + "-" + index;
            return <AsideChat key={uniqueKey} chat={chat} />;
          })}
        {activeSelect === "users" &&
          !isLoading &&
          chats?.data?.chats?.length === 1 && (
            <div className="flex items-center justify-center flex-col gap-2 h-full w-ful">
              <img className="w-1/2" src={cat} alt="No chats available" />
              <p className="text-[#ccc] text-sm font-semibold">
                You are not in any chats yet
              </p>
              <p className="text-[#ccc] text-xs">
                Try searching for one or check out all the chats
              </p>
            </div>
          )}
        {activeSelect === "all" && !isLoading && chats?.data?.length === 0 && (
          <div className="flex items-center justify-center flex-col gap-2 h-full w-ful">
            <img className="w-1/2" src={cat} alt="No chats available" />
            <p className="text-[#ccc] text-sm font-semibold">
              There{"'"}s no chats right now
            </p>
            <p className="text-[#ccc] text-xs">Try creating one!</p>
          </div>
        )}
      </ul>
    </div>
  );
}

AsideChatWrapper.propTypes = {
  chats: PropTypes.array,
};
