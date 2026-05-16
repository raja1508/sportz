"use client"
import CommentaryPanel from "@/components/commentary/CommentaryPanel";
import Header from "@/components/layout/Header";
import MatchGrid from "@/components/match/MatchGrid";
import { DUMMY_COMMENTARY } from "@/data/commentary";

export default function Home() {
  return (
    <div className="h-full bg-[#FAFAFA] gap-10">
      <main className="flex flex-col flex-1 gap-10 ">
        <Header></Header> 

          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-3">
            <MatchGrid />
            </div>
            <div className="col-span-2">
            {/* <CommentaryCard event={DUMMY_COMMENTARY[1][0]} live /> */}
            {/* <CommentaryPanel /> */}
            <CommentaryPanel events={DUMMY_COMMENTARY[1]} connected={true} />
            </div>
        </div>
      </main>
    </div>
  );
}
