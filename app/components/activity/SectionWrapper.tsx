import type { LucideIcon } from "lucide-react";
import './SectionWrapper.css';

type SectionWrapperProps = {
    children: React.ReactNode,
    Icon: LucideIcon,
    title: string
}

export default function SectionWrapper({children, Icon, title}: SectionWrapperProps) {
    return (
        <div className="activity-details-section">
            <Icon className="section-icon dark-gray" size={22}/>
            <div className="section-container">
                <label className="section-heading dark-gray">{title}</label>
                {children}
            </div>
        </div>
    );
};
