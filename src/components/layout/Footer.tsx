
import React from 'react';

interface FooterProps {
    variant?: 'default' | 'minimal';
}

export const Footer: React.FC<FooterProps> = ({ variant = 'default' }) => {
    const currentYear = new Date().getFullYear();

    if (variant === 'minimal') {
        return (
            <footer className="py-6 text-center text-gray-400 text-xs">
                © {currentYear} FACIL Angola. Todos os direitos reservados.
            </footer>
        );
    }

    return (
        <footer className="bg-white border-t mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <h3 className="text-2xl font-black text-blue-700 mb-2">FACIL Angola</h3>
                        <p className="text-gray-500 text-sm mb-4 max-w-md">
                            A plataforma mais segura para comprar, alugar e vender imóveis e viaturas com verificação de identidade em Angola.
                        </p>
                        <div className="flex space-x-4">
                            <SocialIcon icon="📘" label="Facebook" />
                            <SocialIcon icon="📸" label="Instagram" />
                            <SocialIcon icon="▶️" label="YouTube" />
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Explorar</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-blue-600 transition">Casas</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition">Apartamentos</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition">Viaturas</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition">Terrenos</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Suporte</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li><a href="#" className="hover:text-blue-600 transition">Central de Ajuda</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition">Termos de Serviço</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition">Política de Privacidade</a></li>
                            <li><a href="#" className="hover:text-blue-600 transition">Contactos</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
                    <p>© {currentYear} FACIL. Todos os direitos reservados.</p>
                    <p className="mt-2 md:mt-0">
                        Desenvolvido com ❤️ em Angola
                    </p>
                </div>
            </div>
        </footer>
    );
};

const SocialIcon: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
    <a
        href="#"
        className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-blue-100 hover:scale-110 transition"
        aria-label={label}
    >
        <span className="text-lg">{icon}</span>
    </a>
);
