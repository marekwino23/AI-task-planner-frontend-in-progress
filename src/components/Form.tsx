import React, { useState } from "react";
import { motion } from "framer-motion";
import "../styles/MedicaForm.scss";
import FormData from "../types/FormData"

const MedicalForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phone: "",
    address: "",
    symptoms: "",
    allergies: "",
    medications: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted data:", formData);
    alert("Formularz został wysłany!");
  };

  return (
    <div className="form-container">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
        className="medical-form"
      >
        <h2>Formularz wprowadzania danych EMG</h2>
        <p className="text-gray-500 text-center">Wypełnij dane pacjenta oraz informacje zdrowotne</p>

        <div className="input-grid">
          <FancyInput name="firstName" value={formData.firstName} onChange={handleChange} label="Imię" required />
          <FancyInput name="lastName" value={formData.lastName} onChange={handleChange} label="Nazwisko" required />
          {/* <FancyInput type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} label="Data urodzenia" required />
          <FancySelect name="gender" value={formData.gender} onChange={handleChange} label="Płeć" /> */}
        </div>

        <div className="input-grid">
          <FancyInput type="email" name="email" value={formData.email} onChange={handleChange} label="Email" />
          <FancyInput type="tel" name="phone" value={formData.phone} onChange={handleChange} label="Telefon" />
        </div>

        <FancyTextarea name="address" value={formData.address} onChange={handleChange} label="Adres" />
        <FancyTextarea name="symptoms" value={formData.symptoms} onChange={handleChange} label="Objawy" />
        <FancyTextarea name="allergies" value={formData.allergies} onChange={handleChange} label="Alergie" />
        <FancyTextarea name="medications" value={formData.medications} onChange={handleChange} label="Przyjmowane leki" />

        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          type="submit"
          className="submit-btn"
        >
          Wyślij formularz
        </motion.button>
      </motion.form>
    </div>
  );
};

const FancyInput = ({ label, ...props }: any) => (
  <div className="fancy-input">
    <input placeholder=" " {...props} />
    <label>{label}</label>
  </div>
);

const FancyTextarea = ({ label, ...props }: any) => (
  <div className="fancy-input">
    <textarea placeholder=" " {...props} />
    <label>{label}</label>
  </div>
);

// const FancySelect = ({ label, ...props }: any) => (
//   <div className="fancy-input">
//     <select {...props}>
//       <option value="">Wybierz...</option>
//       <option value="male">Mężczyzna</option>
//       <option value="female">Kobieta</option>
//       <option value="other">Inna</option>
//     </select>
//     <label>{label}</label>
//   </div>
// );

export default MedicalForm;
