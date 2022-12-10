import styles from './TodoList.module.css';

import { TbTrash } from 'react-icons/tb';
import checkIcon from '../assets/check.svg';
import { Todo } from '../App';

interface TodoListProps {
    content: Todo;
    onCheck: (todoId: string) => void;
    onDelete: (todoId: string) => void;
}

export function TodoList({ content, onCheck, onDelete }: TodoListProps) {

    

    return (
        <>
            <div className={`${styles.container} ${content.isChecked ? styles.containerChecked : ''}`}>
                <button className={styles.check} onClick={() => onCheck(content.id)}>
                    {content.isChecked ? <img src={checkIcon} alt="Icone de Concluído" /> : <div />}
                </button>
                <p className={content.isChecked ? styles.textChecked : ''}>{content.text}</p>
                <button onClick={() => onDelete(content.id)} title='Deletar ToDo' className={styles.deleteButton}>
                    <TbTrash size={20} />
                </button>
            </div>
        </>
    )
}