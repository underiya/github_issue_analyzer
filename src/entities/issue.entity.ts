import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Repository } from './repository.entity';

@Entity('issues')
export class Issue {
  @PrimaryColumn()
  id: number;

  @Column()
  repository_id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  body: string;

  @Column()
  html_url: string;

  @Column()
  created_at: Date;

  @ManyToOne(() => Repository, (repository) => repository.issues)
  @JoinColumn({ name: 'repository_id' })
  repository: Repository;
}
