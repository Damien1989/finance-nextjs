import Link from "next/link";
import Navbar from "./components/Navbar";
import BudgetItem from "./components/BudgetItem";
import budgets from "./data";

export default function Home() {
  return (
   <div>
    <Navbar />
    <div className="flex items-center justify-center flex-col py-10 w-full"></div>
    <div className="flex flex-col"></div>
    <h1 className="text-4l md:text-5xl font-bold text-center">
      Prenez le contrôle <br /> de vos finances
    </h1>
    <p className="py-6 text-gray-800 text-center">Suivez vos budgets et vos dépenses <br /> en toute simplicité avec notre appli intuitive !</p>

    <ul className="grid md:grid-cols-3 mt-6 gap-4 md:min-w-[1200px]">
         {budgets.map((budget) => (
            <Link href={`/manage/${budget.id}`} key = {budget.id}>
               <BudgetItem budget={budget} enableHover={1}></BudgetItem>
            </Link>
         ))}
      </ul>

   </div>
  );
}
