import font from "@/app/font.module.css";
import Image from "next/image";
import { Loading } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FaChartLine } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import { getCookie, deleteCookie } from "cookies-next";

import CardContainer from "@/components/main/discover/CardContainer";
import CardLabelName from "@/components/main/discover/CardLabelName";
import CardLabelUsername from "@/components/main/discover/CardLabelUsername";

import Follow from "@/api/activity/user/follow";
import Unfollow from "@/api/activity/user/unfollow";
import { IsLogin } from "@/components/main/LoginContext";

import UserTrends from "@/api/profile/user-trends";

export default function User() {
  const router = useRouter();

  const { isLogin } = useContext(IsLogin);

  const [dataProfile, setDataProfile] = useState([]);

  async function follow(id) {
    if (isLogin) {
      setDataProfile(
        dataProfile.map((item) =>
          item.id === id ? { ...item, isFollowed: true } : item
        )
      );
    }
    const res = await Follow(id, getCookie("auth"));

    if (res.status === "200") {
    } else if (res.status === "unauth") {
      router.push("login");
    }
  }

  async function unfollow(id) {
    if (isLogin) {
      setDataProfile(
        dataProfile.map((item) =>
          item.id === id ? { ...item, isFollowed: false } : item
        )
      );
    }
    const res = await Unfollow(id, getCookie("auth"));
    if (res.status === "200") {
    } else if (res.status === "unauth") {
      router.push("login");
    }
  }

  useEffect(() => {
    async function fetchData() {
      const res = await UserTrends(getCookie("auth"));

      if (res) {
        if (res.status === "200") {
          setDataProfile(res.data);
        }
      }
    }
    fetchData();
  }, []);

  return (
    <div className="flex justify-center h-full">
      <div className="flex w-full h-full pt-24">
        <div className="flex flex-col w-full h-full gap-12 px-20 py-8">
          <div className="flex items-center gap-2 p-4">
            <FaChartLine fill="white" />
            <p className={`${font.Satoshi_b2medium} text-white`}>TRENDS</p>
          </div>
          <div className="flex flex-wrap justify-center    gap-6 p-0">
            
            {
            dataProfile.map((element, index) => (
              <CardContainer key={index}>
                <div className="flex items-center gap-2">
                  <Image
                    className="w-12 h-12 object-cover rounded-[50%]"
                    src={
                      process.env.NEXT_PUBLIC_HOST +
                      "/" +
                      process.env.NEXT_PUBLIC_VERSION +
                      element.image
                    }
                    width={220}
                    height={220}
                  />
                  <div className="flex flex-col justify-center w-32 h-10">
                    <CardLabelName name={element.name} />
                    <CardLabelUsername username={"@" + element.username} />
                  </div>
                </div>
                {element.isMyProfile ? (
                  <div
                    className={`${font.Satoshi_c2bold} text-center w-[104px] text-slate-200 py-2 pl-[52px]`}
                  >
                    
                    ME
                  </div>
                ) : element.isFollowed ? (
                  <button
                    className={`${font.Satoshi_c2bold} w-20 h-8 py-2 text-slate-200 border-solid border-slate-700 border-[1px] rounded-3xl`}
                    onClick={() => {
                      unfollow(element.id);
                    }}
                  >
                    Following
                  </button>
                ) : (
                  <button
                    className={`${font.Satoshi_c2bold} w-16 h-8 py-2 text-slate-700 bg-slate-200 border-solid border-white border-[1px] rounded-3xl`}
                    onClick={() => {
                      follow(element.id);
                    }}
                  >
                    Follow
                  </button>
                )}
              
              </CardContainer>
              
            ))
            }
          
          </div>
        </div>
      </div>
    </div>
  );
}