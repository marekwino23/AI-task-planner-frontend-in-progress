import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/MedicaForm.scss";
import { Priority, Task, WeeklyPlan} from "../types/FormData";
import PlanResult from "./PlanResult"



type FancyInputProps =
  React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
  };

type FancySelectProps =
  React.SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
  };

type NewTask = {
    name: string;
    priority: "Low" | "Medium" | "High";
    estimatedHours: number;
}; 

const PlannerForm = () => {
const [plannerData, setPlannerData] = useState({
    goal: "",
    hoursPerDay: 0,
});
const [tasks, setTasks] = useState<Task[]>([]);
const [newTask, setNewTask] = useState<NewTask>({
    name: "",
    priority: "Medium",
    estimatedHours: 1,
});
 const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);

 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value, type } = e.target;

  setPlannerData((prev) => ({
    ...prev,
    [name]: type === "number" ? Number(value) : value,
  }));
};


const removeTask = (id:number)=>{
  setTasks((prev) => prev.filter((task) => task.id !== id));
}

const addTask = () => {
    if (!newTask.name.trim()) return;

    if (newTask.estimatedHours <= 0) return;

    setTasks(prev => [
        ...prev,
        {
            id: Date.now(),
            name: newTask.name,
            priority: newTask.priority,
            estimated_hours: newTask.estimatedHours,
        }
    ]);

    setNewTask({
        name: "",
        priority: "Medium",
        estimatedHours: 1,
    });
};

  async function handleSubmit(e: React.FormEvent) {
    
    e.preventDefault();

    if (tasks.length === 0) {
    alert("Add at least one task");
    return;
}

    const payload = {
  goal: plannerData.goal,
  hours_per_day: plannerData.hoursPerDay,
  tasks
};
    const url = "http://127.0.0.1:8000/generate-plan";
      try {
        const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
      }

    const result: WeeklyPlan = await response.json();
    setWeeklyPlan(result);
  } catch (error: unknown) {
    if (error instanceof Error) {
        console.error(error.message);
    } else {
        console.error("Unknown error:", error);
    }
}
}

  return (
    <div className="form-container">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="medical-form"
      >
        <h2>AI Tasks Planner</h2>

        <div className="input-grid">
         <FancyInput
    value={newTask.name}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setNewTask({
            ...newTask,
            name: e.target.value,
        })
    }
    label="Task"
/>
  <FancySelect
    value={newTask.priority}
    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
        setNewTask({
            ...newTask,
            priority: e.target.value as Priority,
        })
    }
    label="Priority"
/>
   <FancyInput
    type="number"
    value={newTask.estimatedHours}
    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setNewTask({
            ...newTask,
            estimatedHours: Number(e.target.value),
        })
    }
    label="Estimated hours"
/>
          <button type="button" onClick={addTask}>
    Add Task
</button>
          <FancyInput type="text" name="goal" value={plannerData.goal} onChange={handleChange} label="Your goal" required />
          <FancyInput onChange={handleChange}
    type="number"
    label="Hours per day"
    name="hoursPerDay"
    value={plannerData.hoursPerDay}/>
        </div>
         <ul>
         {tasks.map((task:Task) => (
    <li key={task.id}>Name: {task.name} Priority: {task.priority} Estimated_Hours: {task.estimated_hours} <button onClick={() => removeTask(task.id)}>X</button> </li>
))}
          </ul>

        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          type="submit"
          className="submit-btn"
        >
          Send
        </motion.button>
      </motion.form>
   {weeklyPlan && <PlanResult plan={weeklyPlan} />}
    </div>
  );
};

const FancyInput = ({ label, ...props }: FancyInputProps) => (
  <div className="fancy-input">
    <input placeholder=" " {...props} />
    <label>{label}</label>
  </div>
);

const FancySelect = ({ label, ...props }: FancySelectProps) => (
  <div className="fancy-input">
    <select {...props}>
      <option value="">Wybierz...</option>
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
    </select>
    <label>{label}</label>
  </div>
);

export default PlannerForm;
