import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Appointment } from "@/lib/types";
import { format, startOfWeek, addDays, isToday, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AppointmentCalendarProps {
  appointments: Appointment[];
  onAddAppointment: () => void;
}

export function AppointmentCalendar({ appointments, onAddAppointment }: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfCurrentWeek, i));
  
  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", 
    "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const getFormattedMonthYear = () => {
    return format(currentDate, "MMMM yyyy", { locale: ptBR }).replace(/^\w/, (c) => c.toUpperCase());
  };

  const previousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const nextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getDayName = (date: Date) => {
    return format(date, "EEE", { locale: ptBR }).replace(/^\w/, (c) => c.toUpperCase());
  };

  const getDayNumber = (date: Date) => {
    return format(date, "d");
  };

  const getAppointmentsForDateAndTime = (date: Date, time: string) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const appointmentTime = appointment.time;
      return isSameDay(appointmentDate, date) && appointmentTime === time;
    });
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardHeader className="bg-card pb-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={previousWeek}
              className="p-2 rounded-full bg-muted text-gray-300 border border-gray-700 hover:bg-muted"
            >
              <i className="fas fa-chevron-left"></i>
            </Button>
            <CardTitle className="text-lg font-medium text-white">{getFormattedMonthYear()}</CardTitle>
            <Button
              variant="outline"
              size="icon"
              onClick={nextWeek}
              className="p-2 rounded-full bg-muted text-gray-300 border border-gray-700 hover:bg-muted"
            >
              <i className="fas fa-chevron-right"></i>
            </Button>
          </div>
          <Button
            variant="link"
            className="text-sm text-primary hover:underline"
            onClick={goToToday}
          >
            Hoje
          </Button>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-3">
            <Button
              variant={view === "day" ? "default" : "outline"}
              onClick={() => setView("day")}
              className={`text-sm ${
                view === "day" 
                  ? "bg-primary hover:bg-primary/90 text-white" 
                  : "bg-muted text-gray-300 border border-gray-700 hover:bg-muted"
              }`}
            >
              <i className="fas fa-calendar-day mr-2"></i>
              Dia
            </Button>
            <Button
              variant={view === "week" ? "default" : "outline"}
              onClick={() => setView("week")}
              className={`text-sm ${
                view === "week" 
                  ? "bg-primary hover:bg-primary/90 text-white" 
                  : "bg-muted text-gray-300 border border-gray-700 hover:bg-muted"
              }`}
            >
              <i className="fas fa-calendar-week mr-2"></i>
              Semana
            </Button>
            <Button
              variant={view === "month" ? "default" : "outline"}
              onClick={() => setView("month")}
              className={`text-sm ${
                view === "month" 
                  ? "bg-primary hover:bg-primary/90 text-white" 
                  : "bg-muted text-gray-300 border border-gray-700 hover:bg-muted"
              }`}
            >
              <i className="fas fa-calendar-alt mr-2"></i>
              Mês
            </Button>
          </div>
          <Button 
            onClick={onAddAppointment}
            className="bg-primary hover:bg-primary/90 text-white text-sm"
          >
            <i className="fas fa-plus mr-2"></i>
            Novo Agendamento
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {view === "week" && (
          <>
            {/* Days of week */}
            <div className="grid grid-cols-8 border-b border-border">
              <div className="py-3 px-4 border-r border-border bg-muted">
                <span className="sr-only">Horários</span>
              </div>
              {weekDays.map((day, index) => (
                <div
                  key={index}
                  className={`py-3 text-center border-r border-border ${
                    isToday(day) ? "bg-primary/10" : isWeekend(day) ? "bg-muted/50" : ""
                  }`}
                >
                  <p className={`text-sm font-medium ${
                    isToday(day) ? "text-primary" : isWeekend(day) ? "text-gray-400" : "text-white"
                  }`}>
                    {getDayName(day)}
                  </p>
                  <p className={`text-lg font-semibold ${
                    isToday(day) ? "text-primary" : isWeekend(day) ? "text-gray-400" : "text-white"
                  }`}>
                    {getDayNumber(day)}
                  </p>
                </div>
              ))}
            </div>

            {/* Time slots and appointments */}
            <div className="max-h-[600px] overflow-y-auto scrollbar-thin">
              {timeSlots.map((time, timeIndex) => (
                <div key={timeIndex} className="grid grid-cols-8 border-b border-border">
                  <div className="py-4 px-4 border-r border-border bg-muted text-right">
                    <span className="text-sm text-gray-400">{time}</span>
                  </div>
                  
                  {weekDays.map((day, dayIndex) => {
                    const appointmentsForSlot = getAppointmentsForDateAndTime(day, time);
                    const isLunchTime = time === "12:00";
                    const isCurrentDay = isToday(day);
                    const isWeekendDay = isWeekend(day);
                    
                    return (
                      <div 
                        key={dayIndex} 
                        className={`py-2 px-2 border-r border-border relative ${
                          isCurrentDay ? "bg-primary/5" : isWeekendDay ? "bg-muted/30" : ""
                        }`}
                      >
                        {isLunchTime ? (
                          <div className="absolute inset-1 bg-gray-700/30 border-l-4 border-gray-600 rounded-md p-2 text-xs">
                            <p className="font-medium text-gray-400">Almoço</p>
                          </div>
                        ) : appointmentsForSlot.length > 0 ? (
                          <div className={`absolute inset-1 ${
                            appointmentsForSlot[0].procedure === "Botox" ? "bg-primary/20 border-primary" :
                            appointmentsForSlot[0].procedure === "Avaliação" ? "bg-secondary/20 border-secondary" :
                            appointmentsForSlot[0].procedure === "Preenchimento" ? "bg-purple-500/20 border-purple-500" :
                            appointmentsForSlot[0].procedure === "Microagulhamento" ? "bg-pink-500/20 border-pink-500" :
                            appointmentsForSlot[0].procedure === "Limpeza de Pele" ? "bg-accent/20 border-accent" : "bg-primary/20 border-primary"
                          } border-l-4 rounded-md p-2 text-xs`}>
                            <p className="font-medium text-white">{appointmentsForSlot[0].clientName}</p>
                            <p className="text-gray-400">{appointmentsForSlot[0].procedure}</p>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
