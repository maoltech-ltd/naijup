import InsightRoll from "@/src/components/About/InsightRoll";

const insights = [
    "20+ Projects Completed",
    "3+ Years of Freelancing",
    "99% Client Satisfaction",
    "20K+ Subscribers",
    "Authored In-Depth Course on Educative",
    "Contributed as a Technical Course Reviewer 📝",
    "Recipient of the Hackernoon Noonies Award 🏆",
  ];

const aboutLayout:React.FC<any> = ({children}) => {
  return (
    <main className="w-full flex flex-col items-center justify-between">
    <InsightRoll insights={insights} />
    {children}
  </main>
  )
}

export default aboutLayout