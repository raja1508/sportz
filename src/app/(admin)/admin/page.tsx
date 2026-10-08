import AddCommentary from '@/components/(admin)/AddCommentary'
import AdminDashboard from '@/components/(admin)/AdminDashBoard'
import CreateMatch from '@/components/(admin)/CreateMatch'
import MatchCommentaryPanel from '@/components/(admin)/MatchCommentaryPanel'


const Dashboard = () => {
  return (
        <main className='flex-1'>
          {/* <div className='w-full h-20 bg-[#fcd932]'></div> */}
          <div className='w-full h-full'>
            <AdminDashboard></AdminDashboard>
            {/* <CreateMatch></CreateMatch> */}
            {/* <div className='grid grid-cols-5'>
            <div className='col-span-2'>
            <MatchCommentaryPanel
                  match={{
                    sport:     "Cricket",
                    homeTeam:  "Forest Rangers",
                    awayTeam:  "Sunset Blazers",
                    homeScore: 15,
                    awayScore: 0,
                    status:    "live",
                    period:    "1st innings",
                    minute:    13,
                  }}
                  events={[
                    {
                      id: 1, minute: 13, sequence: 533,
                      period: "1st innings", eventType: "START",
                      actor: "Pat Cummins", team: "Forest Rangers",
                      message: "The innings begins with the openers walking out.",
                    },
                    {
                      id: 2, minute: 12, sequence: 532,
                      period: "1st innings", eventType: "OVER_END",
                      actor: "Mitchell Starc", team: "Forest Rangers",
                      message: "End of the over with tidy bowling.",
                    },
                    {
                      id: 3, minute: 11, sequence: 531,
                      period: "1st innings", eventType: "WICKET",
                      actor: "Shubman Gill", team: "Forest Rangers",
                      message: "Wicket! A sharp catch at slip.",
                    },
                    {
                      id: 4, minute: 10, sequence: 530,
                      period: "1st innings", eventType: "SIX",
                      actor: "Virat Kohli", team: "Forest Rangers",
                      message: "Smashed straight down the ground for six.",
                    },
                  ]}/>
                  </div>
                </div> */}
     
                {/* <AddCommentary></AddCommentary> */}
          </div>
        </main>
  )
}

export default Dashboard
