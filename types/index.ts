
export {};

declare global {
    interface Project{
        id: number;
        name: string;
        description: string;
        url: string;
        picpath: string;
    }

    type ProjectList = Project[];
}