import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import UserFactory from 'Database/factories/UserFactory'
export default class extends BaseSeeder {
  public async run() {
    await UserFactory.createMany(10) // Create 10 users from the factory
  }
}
