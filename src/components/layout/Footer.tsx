
import React from 'react';
import { Home, Phone, Mail, MapPin, Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

interface FooterProps {
    variant?: 'default' | 'minimal';
}

export const Footer: React.FC<FooterProps> = ({ variant = 'default' }) => {
    const currentYear = new Date().getFullYear();

    if (variant === 'minimal') {
        return (
            <footer className="py-8 bg-facil-dark">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-400 text-[13px]">
                        © {currentYear} Fácil Angola. Todos os direitos reservados.
                    </p>
                </div>
            </footer>
        );
    }

    return (
        <footer className="bg-facil-dark text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-xl bg-white text-facil-blue">
                                <Home className="w-5 h-5" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">Fácil</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Fácil é o marketplace imobiliário líder em Angola, conectando quem quer comprar, vender ou alugar com segurança e profissionalismo.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Facebook className="w-4 h-4" />} />
                            <SocialIcon icon={<Twitter className="w-4 h-4" />} />
                            <SocialIcon icon={<Instagram className="w-4 h-4" />} />
                            <SocialIcon icon={<Youtube className="w-4 h-4" />} />
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-bold mb-8">Contacte-nos</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="flex gap-3">
                                <div className="animate-icon-bounce">
                                    <MapPin className="w-4 h-4 text-facil-blue shrink-0" />
                                </div>
                                <span>Avenida Lenine, Luanda, Angola</span>
                            </li>
                            <li className="flex gap-3">
                                <div className="animate-icon-pulse">
                                    <Phone className="w-4 h-4 text-facil-blue shrink-0" />
                                </div>
                                <span>+244 923 000 000</span>
                            </li>
                            <li className="flex gap-3">
                                <div className="animate-icon-pulse">
                                    <Mail className="w-4 h-4 text-facil-blue shrink-0" />
                                </div>
                                <span>contato@facil.ao</span>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="text-lg font-bold mb-8">Links Rápidos</h4>
                        <ul className="space-y-3 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-facil-blue transition">Sobre a Fácil</a></li>
                            <li><a href="#" className="hover:text-facil-blue transition">Nossos Agentes</a></li>
                            <li><a href="#" className="hover:text-facil-blue transition">Contactos</a></li>
                            <li><a href="#" className="hover:text-facil-blue transition">Últimas Propriedades</a></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-lg font-bold mb-8">Newsletter</h4>
                        <p className="text-gray-400 text-sm mb-6">Subscreva a nossa newsletter para receber as últimas novidades e ofertas.</p>
                        <form className="flex">
                            <input
                                type="email"
                                placeholder="Seu email"
                                className="bg-white/10 border-0 rounded-l-xl px-4 py-3 text-sm focus:ring-1 focus:ring-facil-blue outline-none w-full"
                            />
                            <button className="bg-facil-blue px-4 py-3 rounded-r-xl text-sm font-bold uppercase tracking-wider hover:bg-blue-700 transition-colors">
                                OK
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
                    <p>© {currentYear} Fácil Angola. Todos os direitos reservados.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition">Política de Privacidade</a>
                        <a href="#" className="hover:text-white transition">Termos e Condições</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
    <a
        href="#"
        className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-facil-blue hover:-translate-y-1 transition-all animate-icon-pulse"
    >
        {icon}
    </a>
);
