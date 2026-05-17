"use client"
import CommentaryPanel from "@/components/commentary/CommentaryPanel";
import Header from "@/components/layout/Header";
import MatchGrid from "@/components/match/MatchGrid";
import { DUMMY_COMMENTARY } from "@/data/commentary";
import useCommentary from "@/hooks/useCommetary";
import { useMatch } from "@/hooks/useMatch";
import { useState } from "react";

export default function Home() {

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const {matches} = useMatch()
  const {events, subscriberCount, status} = useCommentary(selectedId); 


  function handleSelect(matchId: number | null) {
    setSelectedId(matchId);
  }


  return (
    <div className="h-full bg-[#FAFAFA] gap-10">
      <main className="flex flex-col flex-1 gap-10 ">
        <Header></Header> 

          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-3">
            <MatchGrid selectedId={selectedId} matches={matches} onSelect={handleSelect}/>
            </div>
            <div className="col-span-2">
            <CommentaryPanel events={events} connected={status==='connected'} />
            </div>
        </div>
      </main>
    </div>
  );
}
