import React, { useState } from 'react';
import { TransformedData } from './types/types';
import { saveAs } from "file-saver";
import "./styles/styles.scss";
import { generateDocx } from './components/generateDocx'

// 🔐 LOGIN GATE
const LoginGate: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === process.env.REACT_APP_PASSWORD) {
      localStorage.setItem("auth", "true");
      onLogin();
    } else {
      alert("Nieprawidłowe hasło");
    }
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: 10
    }}>
      <h2>🔐 Dostęp do aplikacji</h2>

      <input
        type="password"
        placeholder="Wpisz hasło"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
      />

      <button onClick={handleLogin}>
        Zaloguj
      </button>
    </div>
  );
};

// 🔥 uniwersalny card
const Card: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
    {title && (
      <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">
        {title}
      </h2>
    )}
    {children}
  </div>
);

function App() {
  const [report, setReport] = useState<string>("");
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<TransformedData | null>(null);

  // 🔐 AUTH STATE
  const [isAuth, setIsAuth] = useState(
    localStorage.getItem("auth") === "true"
  );

  const handleDownload = async () => {
    const blob = await generateDocx(parsedReport, patient);
    saveAs(blob, "raport.docx");
  };

  const parseReport = (text: string) => {
    const [opisPart, wniosekPart] = text.split('--- WNIOSEK ---');
    const opis = opisPart?.replace('--- OPIS ---', '').trim();
    const wniosek = wniosekPart?.trim();
    return { opis, wniosek };
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("https://medica-backend-v149.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      setReport(result.report);
      setPatient(result.patient);
      setData(result.nerveData);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const parsedReport = report ? parseReport(report) : null;

  // 🔐 BLOKADA CAŁEJ APPKI
  if (!isAuth) {
    return <LoginGate onLogin={() => setIsAuth(true)} />;
  }

  return (
    <div className="app-container">

      {/* HEADER */}
      <h1 className="text-center text-2xl font-bold">
        Generowanie raportu
      </h1>

      {/* UPLOAD */}
      {!patient && (
        <label className="upload-box">
          📄 Kliknij aby wgrać plik .docx
          <input type="file" onChange={handleFile} hidden />
        </label>
      )}

      {/* LOADER */}
      {loading && (
        <div className="text-center py-6 text-gray-500 animate-pulse">
          Generowanie raportu...
        </div>
      )}

      {/* PACJENT */}
      {patient && !loading && (
        <Card title="Dane pacjenta">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <p><b>Nazwisko:</b> {patient.surname || "-"}</p>
            <p><b>PESEL:</b> {patient.pesel || "-"}</p>
            <p><b>Data urodzenia:</b> {patient.birthDate || "-"}</p>
            <p><b>Data badania:</b> {patient.examDate || "-"}</p>
          </div>
        </Card>
      )}

      {/* SNCS */}
      <div className="card">
        {data?.SNCS && <div className="card__title">SNCS (czuciowe)</div>}
        {data?.SNCS.map((nerve, i) => (
          <div key={i} className="nerve-section">
            <div className="nerve-section__title">{nerve.nerve}</div>

            <table className="table">
              <thead>
                <tr>
                  <th>Miejsce</th>
                  <th>Peak Lat</th>
                  <th>Amp</th>
                  <th>CV</th>
                </tr>
              </thead>

              <tbody>
                {nerve.tests.map((t, j) => (
                  <tr key={j}>
                    <td>{t.site}</td>
                    <td>{t.Peak_Lat_ms ?? "-"}</td>
                    <td>{t.Amp_uV ?? "-"}</td>
                    <td className={t.CV_m_s < 40 ? "danger" : ""}>
                      {t.CV_m_s ?? "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      {/* MNCS */}
      {(data?.MNCS?.length ?? 0) > 0 && (
        <div className="card">
          <div className="card__title">MNCS (ruchowe)</div>

          {data!.MNCS.map((nerve, i) => (
            <div key={i} className="nerve-section">
              <div className="nerve-section__title">
                {nerve.nerve}
              </div>

              <table className="table">
                <thead>
                  <tr>
                    <th>Miejsce</th>
                    <th>Lat (ms)</th>
                    <th>Amp (mV)</th>
                    <th>CV (m/s)</th>
                    <th>F Lat (ms)</th>
                  </tr>
                </thead>

                <tbody>
                  {nerve.tests.map((t, j) => (
                    <tr key={j}>
                      <td>{t.site}</td>
                      <td>{t.Lat_ms ?? "-"}</td>
                      <td className={t.Amp_mV && t.Amp_mV < 1 ? "danger" : ""}>
                        {t.Amp_mV ?? "-"}
                      </td>
                      <td className={t.CV_m_s && t.CV_m_s < 50 ? "danger" : ""}>
                        {t.CV_m_s ?? "-"}
                      </td>
                      <td>{t.F_Lat_ms ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* RAPORT */}
      {parsedReport && !loading && (
        <div className="space-y-6">
          <div className="card">
            <div className="card__title">Opis</div>
            <p className="report-text">{parsedReport.opis}</p>
          </div>

          <div className="card">
            <div className="card__title">Wniosek</div>
            <p className="report-text">{parsedReport.wniosek}</p>
          </div>

          <button onClick={handleDownload}>
            Pobierz raport
          </button>
        </div>
      )}

    </div>
  );
}

export default App;