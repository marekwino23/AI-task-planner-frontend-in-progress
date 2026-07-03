import { WeeklyPlan } from "../types/FormData";

interface Props {
  plan: WeeklyPlan;
}

export default function PlanResult({ plan }: Props) {
  return (
    <div style={{display:"grid", grid:"auto / auto auto auto"}}>
      {plan.days.map(day => (
        <div key={day.day}>
          <h3>Day {day.day}</h3>

          <ul>
            {day.tasks.map(task => (
              <li key={task.title}>
                {task.title} ({task.duration_hours} h)
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}