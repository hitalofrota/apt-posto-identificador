import React, { useState } from "react";
import { FileDown, Download } from "lucide-react";
import { format, parseISO, getYear } from "date-fns";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SERVICES } from "../../constants";
import { Appointment } from "../../types";

interface ReportsTabProps {
  appointments: Appointment[];
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ appointments }) => {
  const [reportDate, setReportDate] = useState("");
  const [reportMonthPart, setReportMonthPart] = useState("");
  const [reportYearPart, setReportYearPart] = useState(
    getYear(new Date()).toString()
  );
  const [reportServiceId, setReportServiceId] = useState("all");

  const monthOptions = [
    { value: "01", label: "Janeiro" }, { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" }, { value: "04", label: "Abril" },
    { value: "05", label: "Maio" }, { value: "06", label: "Junho" },
    { value: "07", label: "Julho" }, { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" }, { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" }, { value: "12", label: "Dezembro" },
  ];

  const currentYear = getYear(new Date());
  const yearOptions = Array.from({ length: 6 }, (_, i) =>
    (currentYear - 2 + i).toString()
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Relatório de Agendamentos - Ibicuitinga", 14, 22);
    doc.setFontSize(11);
    doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm")}`, 14, 30);

    let filtered = [...appointments];

    if (reportDate) {
      filtered = filtered.filter((app) => app.date === reportDate);
      doc.text(`Filtro: Data específica ${format(parseISO(reportDate), "dd/MM/yyyy")}`, 14, 38);
    }

    const combinedMonthYear = reportMonthPart ? `${reportYearPart}-${reportMonthPart}` : "";
    if (combinedMonthYear && !reportDate) {
      filtered = filtered.filter((app) => app.date.startsWith(combinedMonthYear));
      const monthLabel = monthOptions.find((m) => m.value === reportMonthPart)?.label;
      doc.text(`Filtro: Período ${monthLabel} de ${reportYearPart}`, 14, 38);
    }

    if (reportServiceId !== "all") {
      const sName = SERVICES.find((s) => s.id === reportServiceId)?.name;
      filtered = filtered.filter((app) => app.serviceId === reportServiceId);
      doc.text(`Filtro: Serviço - ${sName}`, 14, reportDate || combinedMonthYear ? 43 : 38);
    }

    const tableData = filtered.map((app) => [
      app.protocol,
      app.citizen.name,
      app.serviceName,
      `${format(parseISO(app.date), "dd/MM/yyyy")} ${app.time}`,
      app.status === "scheduled" ? "Ativo" : app.status === "cancelled" ? "Cancelado" : "Concluído",
    ]);

    autoTable(doc, {
      head: [["Protocolo", "Cidadão", "Serviço", "Data/Hora", "Status"]],
      body: tableData,
      startY: reportDate || combinedMonthYear || reportServiceId !== "all" ? 50 : 40,
      theme: "grid",
      headStyles: { fillColor: [23, 38, 93] },
    });

    doc.save(`relatorio-agendamentos-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  };

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl space-y-8 animate-fade-in border-2 border-ibicuitinga-skyBlue/10">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-ibicuitinga-royalBlue/10 rounded-3xl flex items-center justify-center mx-auto text-ibicuitinga-royalBlue">
          <FileDown size={32} />
        </div>
        <h3 className="text-2xl font-black text-ibicuitinga-navy uppercase tracking-tighter">
          Central de Relatórios
        </h3>
        <p className="text-gray-500 font-medium text-sm">
          Selecione os filtros desejados para exportar o PDF personalizado.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
        {/* Filtro por Dia */}
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Por Dia</label>
          <input
            type="date"
            value={reportDate}
            onChange={(e) => {
              setReportDate(e.target.value);
              if (e.target.value) setReportMonthPart("");
            }}
            className="w-full bg-white border-2 border-gray-100 rounded-xl p-3 font-bold text-ibicuitinga-navy text-sm outline-none focus:border-ibicuitinga-royalBlue"
          />
        </div>

        {/* Filtro por Mês */}
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Por Mês</label>
          <div className="flex gap-2">
            <select
              value={reportMonthPart}
              onChange={(e) => {
                setReportMonthPart(e.target.value);
                if (e.target.value) setReportDate("");
              }}
              className="flex-[2] bg-white border-2 border-gray-100 rounded-xl p-3 font-bold text-ibicuitinga-navy text-sm outline-none appearance-none focus:border-ibicuitinga-royalBlue"
            >
              <option value="">Selecione o mês</option>
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={reportYearPart}
              onChange={(e) => setReportYearPart(e.target.value)}
              className="flex-1 bg-white border-2 border-gray-100 rounded-xl p-3 font-bold text-ibicuitinga-navy text-sm outline-none appearance-none focus:border-ibicuitinga-royalBlue"
            >
              {yearOptions.map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filtro por Serviço */}
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Por Serviço</label>
          <select
            value={reportServiceId}
            onChange={(e) => setReportServiceId(e.target.value)}
            className="w-full bg-white border-2 border-gray-100 rounded-xl p-3 font-bold text-ibicuitinga-navy text-sm outline-none appearance-none focus:border-ibicuitinga-royalBlue"
          >
            <option value="all">Todos os Serviços</option>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
        <button
          onClick={() => {
            setReportDate("");
            setReportMonthPart("");
            setReportYearPart(getYear(new Date()).toString());
            setReportServiceId("all");
          }}
          className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-500 transition-colors"
        >
          Limpar Filtros
        </button>
        <button
          onClick={generatePDF}
          className="bg-ibicuitinga-navy text-white px-10 py-5 rounded-2xl font-black uppercase text-sm tracking-widest shadow-xl hover:bg-ibicuitinga-royalBlue transition-all flex items-center gap-3 active:scale-95"
        >
          <Download size={20} /> Gerar PDF Filtrado
        </button>
      </div>
    </div>
  );
};