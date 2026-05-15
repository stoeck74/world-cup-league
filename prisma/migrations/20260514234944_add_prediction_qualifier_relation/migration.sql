-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_qualifierTeamId_fkey" FOREIGN KEY ("qualifierTeamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
