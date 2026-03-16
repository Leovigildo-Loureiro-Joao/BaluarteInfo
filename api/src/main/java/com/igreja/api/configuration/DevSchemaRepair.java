package com.igreja.api.configuration;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Profile("dev")
public class DevSchemaRepair implements ApplicationRunner {
    private static final Logger log = LoggerFactory.getLogger(DevSchemaRepair.class);

    private final JdbcTemplate jdbcTemplate;

    public DevSchemaRepair(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        // Corrige esquemas antigos onde colunas de texto ficaram como BYTEA no Postgres.
        repairToText("midia", List.of("titulo", "descricao"));
        repairToText("actividade", List.of("titulo", "tema", "descricao"));
    }

    private void repairToText(String table, List<String> columns) {
        for (String column : columns) {
            String udtName = jdbcTemplate.query(
                    """
                        SELECT udt_name
                        FROM information_schema.columns
                        WHERE table_schema = 'public'
                          AND table_name = ?
                          AND column_name = ?
                    """,
                    rs -> rs.next() ? rs.getString(1) : null,
                    table,
                    column);

            if (udtName == null) {
                continue;
            }
            if (!"bytea".equalsIgnoreCase(udtName)) {
                continue;
            }

            String quotedTable = quoteIdentifier(table);
            String quotedColumn = quoteIdentifier(column);

            log.warn("Reparando coluna {}.{} (BYTEA -> TEXT) para evitar erro de LOWER(bytea).", table, column);

            jdbcTemplate.execute(
                    "ALTER TABLE " + quotedTable + " ALTER COLUMN " + quotedColumn
                            + " TYPE TEXT USING convert_from(" + quotedColumn + ", 'UTF8')");
            jdbcTemplate.execute("UPDATE " + quotedTable + " SET " + quotedColumn + " = '' WHERE " + quotedColumn + " IS NULL");
            jdbcTemplate.execute("ALTER TABLE " + quotedTable + " ALTER COLUMN " + quotedColumn + " SET DEFAULT ''");
        }
    }

    private static String quoteIdentifier(String identifier) {
        return "\"" + identifier.replace("\"", "\"\"") + "\"";
    }
}

