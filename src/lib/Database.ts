interface DatabaseRunner {
  trx:SQLTransaction;
  query(sql: string, params?: ObjectArray): any;
}

export class BotDatabase {
  private readonly db = window.openDatabase('bot', '1.0', 'Bot', 102400)

  async query(sql: string, params?: ObjectArray): Promise<SQLResultSet> {
    return this.transaction(runner => runner.query(sql, params))
  }

  async transaction(cb: (runner: DatabaseRunner) => Promise<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.readTransaction((trx) => {
        resolve(
          cb({
            trx,
            query(sql: string, params: ObjectArray = []) {
              return new Promise((resolve, reject) => {
                trx.executeSql(
                  sql, params,
                  (transaction, result) => resolve(result),
                  (trx, error) => {
                    console.log('AAAAAA', error)
                    reject(error)
                    return false
                  }
                )
              })
            }
          })
        )
      })
    })
  }
}