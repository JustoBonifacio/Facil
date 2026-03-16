
import React from 'react';
import { Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { Appointment, Listing } from '../../../shared/types';

interface AppointmentsTabProps {
    appointments: Appointment[];
    listings: Listing[];
    onListingClick: (id: string) => void;
    onSyncCalendar: () => void;
    onShowSecurityProtocol: () => void;
}

export const AppointmentsTab: React.FC<AppointmentsTabProps> = ({
    appointments,
    listings,
    onListingClick,
    onSyncCalendar,
    onShowSecurityProtocol
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
            <section className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 flex flex-col">
                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center">
                    <span className="bg-blue-50 p-3 rounded-xl mr-4 text-facil-blue animate-icon-pulse">
                        <Calendar className="w-6 h-6" />
                    </span>
                    Agenda de Visitas
                </h2>
                <div className="flex-grow space-y-4">
                    {appointments.length === 0 ? (
                        <div className="p-10 text-center border-2 border-dashed border-slate-100 rounded-xl">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Sem eventos agendados</p>
                        </div>
                    ) : (
                        appointments.map(appt => {
                            const listing = listings.find(l => l.id === appt.listingId);
                            const apptDate = new Date(appt.date);
                            return (
                                <div key={appt.id} className="p-6 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all duration-300">
                                    <div className="flex items-center gap-5">
                                        <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 text-center min-w-[70px]">
                                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                {apptDate.toLocaleString('pt-PT', { month: 'short' })}
                                            </span>
                                            <span className="block text-2xl font-black text-facil-blue">
                                                {apptDate.getDate()}
                                            </span>
                                        </div>
                                        <div>
                                            <h4
                                                onClick={() => listing && onListingClick(listing.id)}
                                                className="font-black text-slate-900 line-clamp-1 hover:text-facil-blue cursor-pointer transition"
                                            >
                                                {listing?.title || 'Imóvel'}
                                            </h4>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                                {apptDate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} · {appt.status}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onSyncCalendar}
                                        className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition text-slate-400 hover:text-facil-blue border border-slate-100 hover:border-facil-blue/30"
                                    >
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            <section className="bg-gradient-to-br from-slate-900 to-facil-blue p-10 rounded-xl text-white shadow-2xl relative overflow-hidden flex flex-col justify-end min-h-[400px]">
                <div className="absolute top-10 right-10 opacity-10 animate-pulse">
                    <ShieldCheck className="w-64 h-64" />
                </div>
                <div className="relative z-10">
                    <span className="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Dica de Pró</span>
                    <h3 className="text-3xl font-black mb-4 tracking-tight">Visitas Seguras</h3>
                    <p className="text-blue-100/70 mb-8 leading-relaxed font-medium">
                        Todas as visitas agendadas via Fácil incluem um código de segurança único.
                        Nunca visite um imóvel sem o seu código ativo no dashboard.
                    </p>
                    <button
                        onClick={onShowSecurityProtocol}
                        className="w-full py-4 bg-white text-facil-blue rounded-xl font-black hover:bg-slate-50 transition-all shadow-2xl hover:scale-[1.02] active:scale-95 text-[10px] uppercase tracking-[0.2em]"
                    >
                        Aprender Protocolo de Segurança
                    </button>
                </div>
            </section>
        </div>
    );
};
