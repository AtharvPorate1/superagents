'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var image_1 = require("next/image");
var link_1 = require("next/link");
var button_1 = require("@/components/ui/button");
var card_1 = require("@/components/ui/card");
var lucide_react_1 = require("lucide-react");
function LandingPage() {
    var _a = react_1.useState(false), isMenuOpen = _a[0], setIsMenuOpen = _a[1];
    var toggleMenu = function () {
        setIsMenuOpen(!isMenuOpen);
    };
    return (react_1["default"].createElement("div", { className: "min-h-screen bg-yellow-200 font-mono" },
        react_1["default"].createElement("nav", { className: "bg-black  text-white py-4 px-6 sticky top-0 z-10" },
            react_1["default"].createElement("div", { className: "container md:w-4/5 mx-auto flex justify-between items-center" },
                react_1["default"].createElement(link_1["default"], { href: "/", className: "text-2xl font-bold" }, "SUPERAGENT"),
                react_1["default"].createElement("div", { className: "hidden md:flex space-x-8" },
                    react_1["default"].createElement(NavLink, { href: "#features" }, "Features"),
                    react_1["default"].createElement(NavLink, { href: "#cta" }, "Get Started"),
                    react_1["default"].createElement(NavLink, { href: "#contact" }, "Contact")),
                react_1["default"].createElement("button", { className: "md:hidden", onClick: toggleMenu }, isMenuOpen ? react_1["default"].createElement(lucide_react_1.X, { size: 24 }) : react_1["default"].createElement(lucide_react_1.Menu, { size: 24 })))),
        isMenuOpen && (react_1["default"].createElement("div", { className: "md:hidden bg-black text-white py-4 px-6" },
            react_1["default"].createElement("div", { className: "flex flex-col space-y-4" },
                react_1["default"].createElement(NavLink, { href: "#features", onClick: toggleMenu }, "Features"),
                react_1["default"].createElement(NavLink, { href: "#cta", onClick: toggleMenu }, "Get Started"),
                react_1["default"].createElement(NavLink, { href: "#contact", onClick: toggleMenu }, "Contact")))),
        react_1["default"].createElement("section", { className: "container md:w-4/5 mx-auto py-20 px-4" },
            react_1["default"].createElement("div", { className: "flex flex-col md:flex-row items-center justify-between" },
                react_1["default"].createElement("div", { className: "md:w-1/2 mb-10 md:mb-0" },
                    react_1["default"].createElement("h1", { className: "text-5xl md:text-6xl font-bold mb-6 uppercase" },
                        "Superagent: ",
                        react_1["default"].createElement("br", null),
                        " Your Supercharged ",
                        react_1["default"].createElement("br", null),
                        " AI Assistant"),
                    react_1["default"].createElement("p", { className: "text-2xl mb-8" }, "Imagine Jarvis, but cooler and with a better sense of humor!"),
                    react_1["default"].createElement(link_1["default"], { href: "/product" },
                        react_1["default"].createElement(button_1.Button, { className: "bg-black text-white text-xl py-6 px-8 rounded-none border-4 border-black hover:bg-white hover:text-black transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1" }, "Get Supercharged!"))),
                react_1["default"].createElement("div", { className: "md:w-1/2" },
                    react_1["default"].createElement("div", { className: "bg-white border-8 border-black p-4 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]" },
                        react_1["default"].createElement(image_1["default"], { src: "/supercharged.webp", alt: "Superagent in action", width: 500, height: 500, className: "w-full h-auto", priority: true }))))),
        react_1["default"].createElement("section", { id: "features", className: "bg-blue-500 py-20 px-4" },
            react_1["default"].createElement("div", { className: "container md:w-4/5 mx-auto" },
                react_1["default"].createElement("h2", { className: "text-5xl font-bold mb-12 text-center uppercase" }, "What makes Superagent so super?"),
                react_1["default"].createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" },
                    react_1["default"].createElement(FeatureCard, { icon: react_1["default"].createElement(lucide_react_1.Calendar, { className: "w-12 h-12" }), title: "Schedule Like a Boss", description: "Book meetings faster than you can say 'synergy'!" }),
                    react_1["default"].createElement(FeatureCard, { icon: react_1["default"].createElement(lucide_react_1.Plane, { className: "w-12 h-12" }), title: "Fly Me to the Moon", description: "Book flights while you're still dreaming about your vacation." }),
                    react_1["default"].createElement(FeatureCard, { icon: react_1["default"].createElement(lucide_react_1.BotIcon, { className: "w-12 h-12" }), title: "AI Brainpower", description: "It's like having Einstein on speed dial, but cooler." }),
                    react_1["default"].createElement(FeatureCard, { icon: react_1["default"].createElement(lucide_react_1.Bolt, { className: "w-12 h-12" }), title: "Lightning Fast", description: "Blink and you might miss it. It's that quick!" }),
                    react_1["default"].createElement(FeatureCard, { icon: react_1["default"].createElement(lucide_react_1.Star, { className: "w-12 h-12" }), title: "Personalized Magic", description: "It knows you better than you know yourself. Creepy? Nah, just super!" }),
                    react_1["default"].createElement(FeatureCard, { icon: react_1["default"].createElement(lucide_react_1.Zap, { className: "w-12 h-12" }), title: "Supercharged Everything", description: "If it's not supercharged, we don't do it. Simple as that." })))),
        react_1["default"].createElement("section", { id: "cta", className: "container md:w-4/5 mx-auto py-20 px-4" },
            react_1["default"].createElement("div", { className: "flex flex-col md:flex-row items-center justify-between" },
                react_1["default"].createElement("div", { className: "md:w-1/2 mb-10 md:mb-0" },
                    react_1["default"].createElement("h2", { className: "text-5xl font-bold mb-8 uppercase" }, "Ready to Supercharge Your Life?"),
                    react_1["default"].createElement("p", { className: "text-2xl mb-12" }, "Join the league of extraordinary individuals who've embraced the power of Superagent!"),
                    react_1["default"].createElement(button_1.Button, { className: "bg-black text-white text-xl py-6 px-8 rounded-none border-4 border-black hover:bg-white hover:text-black transition-all duration-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1" }, "Become Super Now!")),
                react_1["default"].createElement("div", { className: "md:w-1/2" },
                    react_1["default"].createElement("div", { className: "bg-white border-8 border-black p-4 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]" },
                        react_1["default"].createElement(image_1["default"], { src: "/battery.webp", alt: "Supercharged life with Superagent", width: 500, height: 500, className: "w-full h-auto" }))))),
        react_1["default"].createElement("footer", { id: "contact", className: "bg-black text-white py-12 px-4" },
            react_1["default"].createElement("div", { className: "container md:w-4/5 mx-auto" },
                react_1["default"].createElement("div", { className: "flex flex-col md:flex-row justify-between items-center" },
                    react_1["default"].createElement("div", { className: "mb-8 md:mb-0" },
                        react_1["default"].createElement("h3", { className: "text-3xl font-bold mb-4" }, "SUPERAGENT"),
                        react_1["default"].createElement("p", { className: "text-xl" }, "Making your life super, one task at a time!")),
                    react_1["default"].createElement("div", { className: "flex space-x-6" },
                        react_1["default"].createElement(SocialLink, { href: "https://twitter.com", icon: react_1["default"].createElement(lucide_react_1.Twitter, { size: 24 }) }),
                        react_1["default"].createElement(SocialLink, { href: "https://facebook.com", icon: react_1["default"].createElement(lucide_react_1.Facebook, { size: 24 }) }),
                        react_1["default"].createElement(SocialLink, { href: "https://instagram.com", icon: react_1["default"].createElement(lucide_react_1.Instagram, { size: 24 }) }),
                        react_1["default"].createElement(SocialLink, { href: "https://linkedin.com", icon: react_1["default"].createElement(lucide_react_1.Linkedin, { size: 24 }) }))),
                react_1["default"].createElement("div", { className: "mt-12 text-center" },
                    react_1["default"].createElement("p", { className: "text-xl" }, "\u00A9 2023 Superagent - All rights reserved"))))));
}
exports["default"] = LandingPage;
function FeatureCard(_a) {
    var icon = _a.icon, title = _a.title, description = _a.description;
    return (react_1["default"].createElement(card_1.Card, { className: "border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-300" },
        react_1["default"].createElement(card_1.CardContent, { className: "p-6" },
            react_1["default"].createElement("div", { className: "mb-4" }, icon),
            react_1["default"].createElement("h3", { className: "text-2xl font-bold mb-2" }, title),
            react_1["default"].createElement("p", { className: "text-lg" }, description))));
}
function NavLink(_a) {
    var href = _a.href, children = _a.children, onClick = _a.onClick;
    return (react_1["default"].createElement(link_1["default"], { href: href, className: "text-white hover:text-yellow-200 font-bold text-lg transition-colors duration-300", onClick: onClick }, children));
}
function SocialLink(_a) {
    var href = _a.href, icon = _a.icon;
    return (react_1["default"].createElement(link_1["default"], { href: href, className: "text-white hover:text-yellow-200 transition-colors duration-300" }, icon));
}
