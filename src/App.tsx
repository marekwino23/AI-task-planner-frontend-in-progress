import React, { useState } from 'react';
import { TransformedData } from './types/types';
import { saveAs } from "file-saver";
import "./styles/styles.scss";
import { generateDocx } from './components/generateDocx';

type Report = {
  opis: string;
  wniosek: string;
};

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
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
      />

      <button onClick={handleLogin}>Zaloguj</button>
    </div>
  );
};

const Card: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
    {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
    {children}
  </div>
);

function App() {
  const [reportRaw, setReportRaw] = useState<string>("");
  const [report, setReport] = useState<Report | null>(null);

  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TransformedData | null>(null);

  const [isAuth, setIsAuth] = useState(
    localStorage.getItem("auth") === "true"
  );

  const parseReport = (text: string): Report => {
    const [opisPart, wniosekPart] = text.split("WNIOSEK:");

    return {
      opis: opisPart.replace("OPIS:", "").trim(),
      wniosek: (wniosekPart ?? "").trim()
    };
  };

  const handleDownload = async () => {
    const blob = await generateDocx(report, patient);
    saveAs(blob, "raport.docx");
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://medica-backend-v149.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      setReportRaw(result.report);
      setReport(parseReport(result.report));

      setPatient(result.patient);
      setData(result.nerveData);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuth) {
    return <LoginGate onLogin={() => setIsAuth(true)} />;
  }

  return (
    <div className="app-container">

      <h1 className="text-center text-2xl font-bold">
        Generowanie raportu
      </h1>

      {!patient && (
        <label className="upload-box">
          📄 Kliknij aby wgrać plik .docx
          <input type="file" onChange={handleFile} hidden />
        </label>
      )}

      {loading && (
        <div className="text-center py-6 text-gray-500 animate-pulse">
          Generowanie raportu...
        </div>
      )}

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
        {data?.SNCS?.length ? (
          <>
            <div className="card__title">SNCS (czuciowe)</div>

            {data.SNCS.map((nerve, i) => (
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
                        <td className={t.CV_m_s !== undefined && t.CV_m_s < 40 ? "danger" : ""}>
                          {t.CV_m_s ?? "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </>
        ) : null}
      </div>

      {/* MNCS */}
      {data?.MNCS?.length ? (
        <div className="card">
          <div className="card__title">MNCS (ruchowe)</div>

          {data.MNCS.map((nerve, i) => (
            <div key={i} className="nerve-section">
              <div className="nerve-section__title">{nerve.nerve}</div>

              <table className="table">
                <thead>
                  <tr>
                    <th>Miejsce</th>
                    <th>Lat</th>
                    <th>Amp</th>
                    <th>CV</th>
                    <th>F Lat</th>
                  </tr>
                </thead>

                <tbody>
                  {nerve.tests.map((t, j) => (
                    <tr key={j}>
                      <td>{t.site}</td>
                      <td>{t.Lat_ms ?? "-"}</td>

                      <td className={t.Amp_mV !== undefined && t.Amp_mV < 1 ? "danger" : ""}>
                        {t.Amp_mV ?? "-"}
                      </td>

                     <td className={t.CV_m_s != null && t.CV_m_s < 50 ? "danger" : ""}>
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
      ) : null}

      {/* RAPORT */}
      {report && !loading && (
        <div className="space-y-6">
          <div className="card">
            <div className="card__title">Opis</div>
            <p className="report-text">{report.opis}</p>
          </div>

          <div className="card">
            <div className="card__title">Wniosek</div>
            <p className="report-text">{report.wniosek}</p>
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