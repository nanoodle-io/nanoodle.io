package com.nanolookup;

import java.text.DecimalFormat;
import java.util.List;
import java.util.ListIterator;

import org.nano.client.AccountHistory;
import org.nano.client.BlockCount;
import org.nano.client.History;
import org.nano.client.NanoClient;

public class AccountLookup
{
	public static void main(String[] args)
	{
		History tempHist;
		String tempAmount;
		String tempMRai;
		String tempDecimal;
		String tempFormattedAmount;
		int tempInd;
		
		DecimalFormat decimalFormat = new DecimalFormat("0.################################");
		NanoClient client = new NanoClient();
		
		//status
		client.getBlockCount();
		client.getNodeVersion();
		
		//-1 gets all to open block - we don't know when this was last run
		AccountHistory tempAcc = client.getAccountHistory(args[0],-1);
		List<History> accTransactions = tempAcc.getHistory();
		
		//go through and print transactions in list
	    for (ListIterator<History> it = accTransactions.listIterator(); it.hasNext(); )
	    {
	    	tempHist = it.next();
	    	tempAmount = tempHist.getAmount();
	    	tempMRai = client.mraiFromRaw(tempAmount);
	    	tempInd = tempMRai.length();
	    	tempDecimal = tempAmount.substring(tempInd);
	    	tempFormattedAmount = decimalFormat.format(Double.valueOf(tempMRai + "." + tempDecimal));
	    	System.out.println(tempHist.getHash() + " : " + tempHist.getAccount() + " : " + tempHist.getType() + " : " + tempFormattedAmount);
	    }
	}
}